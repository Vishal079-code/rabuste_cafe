const ArtGallery = ({ art, loading, insights }) => {
  return (
    <section id="art">
      <p className="section-kicker">Art Gallery</p>
      <div className="section-header">
        <h2 className="section-title">Limited pieces inspired by crema, light, and texture.</h2>
        <span className="pill">Backend-priced · Availability-aware</span>
      </div>
      {insights && (
        <div className="blur-panel" style={{ margin: '12px 0 18px' }}>
          <strong>Popular picks:</strong>{' '}
          <span className="muted">
            {insights.premiumArt?.map((p) => p.title).join(' · ') || 'Loading'}
          </span>
        </div>
      )}
      {loading ? (
        <p className="muted">Loading art…</p>
      ) : (
        <div className="grid three">
          {art.map((piece) => (
            <div className="card" key={piece._id || piece.title}>
              <div
                style={{
                  borderRadius: 12,
                  height: 160,
                  backgroundImage: `linear-gradient(120deg, rgba(24,18,16,0.4), rgba(24,18,16,0.9)), url(${piece.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: 12,
                }}
              />
              <div className="flex" style={{ justifyContent: 'space-between' }}>
                <h3>{piece.title}</h3>
                <span className="pill">{piece.artistName}</span>
              </div>
              <p className="muted" style={{ margin: '6px 0 10px' }}>
                {piece.description}
              </p>
              <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={piece.availability === 'sold' ? 'sold' : 'availability'}>
                  {piece.availability === 'sold' ? 'Sold' : piece.availability}
                </span>
                <span className="pill">${piece.price}</span>
              </div>
              <button
                className="cta secondary"
                style={{ marginTop: 12 }}
                onClick={() => alert('We will route you to our concierge shortly.')}
                disabled={piece.availability === 'sold'}
              >
                Enquire / Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ArtGallery;








