const pillars = [
  {
    title: 'Strength with clarity',
    body: 'Robusta carries thicker crema, higher caffeine, and a textured body that stands up in milk or tonic.',
  },
  {
    title: 'Flavor that holds art',
    body: 'Deep cacao, burnt caramel, and spice give a canvas for playful ingredients without losing coffee.',
  },
  {
    title: 'Philosophy',
    body: 'We celebrate overlooked origins. Boldness is the point, not a side note.',
  },
];

const WhyRobusta = () => {
  return (
    <section id="why">
      <p className="section-kicker">Why Robusta</p>
      <h2 className="section-title">Because loud coffee can still feel cozy.</h2>
      <div className="grid three">
        {pillars.map((p) => (
          <div className="card" key={p.title}>
            <h3>{p.title}</h3>
            <p className="muted" style={{ marginTop: 8 }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyRobusta;

