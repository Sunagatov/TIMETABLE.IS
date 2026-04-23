export function NeedsReviewPage() {
  return (
    <main className="page">
      <aside className="sidebar">
        <h2>Categories</h2>
        <p>Collapsible category tree will live here.</p>
      </aside>

      <section className="content">
        <header className="page-header">
          <h1>Needs Review</h1>
          <p>Default landing view for Memora V1.</p>
        </header>

        <section className="controls">
          <input type="text" placeholder="Search..." />
          <button type="button">Filters</button>
          <button type="button">Sort</button>
        </section>

        <section className="placeholder-card">
          <h3>No review items yet</h3>
          <p>This is a starter shell only.</p>
        </section>
      </section>
    </main>
  );
}
