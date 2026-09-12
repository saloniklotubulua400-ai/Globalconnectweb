import "./ServiceCard.css";

export default function ServiceCard({
  icon,
  title,
  description,
  color = "blue",
  href,
  onClick,
  actionLabel = "Explore",
}) {
  const isInteractive = Boolean(href || onClick);
  const cardClasses = `service-card service-card--${color}`;

  const content = (
    <>
      <div className="service-card__icon">{icon}</div>

      <h3 className="service-card__title">{title}</h3>

      <p className="service-card__description">{description}</p>

      {isInteractive && (
        <span className="service-card__action">
          {actionLabel}
          <span className="service-card__arrow">→</span>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`service-card--link ${cardClasses}`}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`service-card--button ${cardClasses}`}
      >
        {content}
      </button>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}