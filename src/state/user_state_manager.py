class UserStateManager:
    def __init__(self):
        self._states = {}
    
    def set_state(self, user_id: int, state: dict):
        self._states[user_id] = state
    
    def get_state(self, user_id: int) -> dict:
        return self._states.get(user_id)
    
    def clear_state(self, user_id: int):
        if user_id in self._states:
            del self._states[user_id]