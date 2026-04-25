package com.sunagatov.memora.backend.transcription.infrastructure

import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import kotlin.io.path.deleteIfExists
import org.springframework.stereotype.Component

data class PreparedTranscriptionAudio(
    val bytes: ByteArray,
    val fileName: String,
    val contentType: String
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PreparedTranscriptionAudio

        if (!bytes.contentEquals(other.bytes)) return false
        if (fileName != other.fileName) return false
        if (contentType != other.contentType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = bytes.contentHashCode()
        result = 31 * result + fileName.hashCode()
        result = 31 * result + contentType.hashCode()
        return result
    }
}

@Component
class TranscriptionAudioPreparer {

    fun prepare(downloadedVoice: DownloadedTelegramVoice): PreparedTranscriptionAudio {
        val extension = extensionOf(downloadedVoice.fileName, downloadedVoice.mimeType)

        if (extension in SUPPORTED_EXTENSIONS) {
            return PreparedTranscriptionAudio(
                bytes = downloadedVoice.bytes,
                fileName = ensureFileName(downloadedVoice.fileName, extension),
                contentType = contentTypeFor(extension)
            )
        }

        return convertToWav(downloadedVoice, extension)
    }

    private fun convertToWav(
        downloadedVoice: DownloadedTelegramVoice,
        extension: String
    ): PreparedTranscriptionAudio {
        val tempDirectory = Files.createTempDirectory("memora-transcription-")
        val inputPath = tempDirectory.resolve("input.$extension")
        val outputPath = tempDirectory.resolve("converted.wav")
        var process: Process? = null

        return try {
            Files.write(inputPath, downloadedVoice.bytes)

            process = ProcessBuilder(
                "ffmpeg",
                "-y",
                "-i",
                inputPath.toString(),
                outputPath.toString()
            )
                .redirectErrorStream(true)
                .start()

            val output = process.inputStream.bufferedReader().use { it.readText() }
            val exitCode = try {
                process.waitFor()
            } catch (exception: InterruptedException) {
                process.destroyForcibly()
                throw exception
            }

            if (exitCode != 0 || Files.notExists(outputPath)) {
                throw IllegalStateException(
                    "ffmpeg audio conversion failed. Install ffmpeg locally or inspect the backend container logs. " +
                        "ffmpeg output: $output"
                )
            }

            PreparedTranscriptionAudio(
                bytes = Files.readAllBytes(outputPath),
                fileName = "voice.wav",
                contentType = "audio/wav"
            )
        } catch (exception: InterruptedException) {
            process?.destroyForcibly()
            Thread.currentThread().interrupt()
            throw IllegalStateException("ffmpeg audio conversion was interrupted", exception)
        } catch (exception: IOException) {
            throw IllegalStateException(
                "ffmpeg is required for unsupported Telegram voice formats such as .$extension",
                exception
            )
        } finally {
            cleanup(tempDirectory, inputPath, outputPath)
        }
    }

    private fun extensionOf(fileName: String, mimeType: String?): String {
        val fromName = fileName.substringAfterLast('.', "").lowercase()
        if (fromName.isNotBlank()) {
            return fromName
        }

        return when (mimeType?.lowercase()) {
            "audio/ogg" -> "oga"
            "audio/opus" -> "opus"
            "audio/webm" -> "webm"
            "audio/wav", "audio/x-wav" -> "wav"
            "audio/mpeg" -> "mp3"
            else -> "bin"
        }
    }

    private fun ensureFileName(fileName: String, extension: String): String =
        if (fileName.contains('.')) fileName else "voice.$extension"

    private fun contentTypeFor(extension: String): String =
        when (extension) {
            "mp3" -> "audio/mpeg"
            "mp4" -> "audio/mp4"
            "mpeg", "mpga" -> "audio/mpeg"
            "m4a" -> "audio/mp4"
            "wav" -> "audio/wav"
            "webm" -> "audio/webm"
            else -> "application/octet-stream"
        }

    private fun cleanup(tempDirectory: Path, inputPath: Path, outputPath: Path) {
        inputPath.deleteIfExists()
        outputPath.deleteIfExists()
        tempDirectory.deleteIfExists()
    }

    private companion object {
        val SUPPORTED_EXTENSIONS = setOf("mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm")
    }
}
