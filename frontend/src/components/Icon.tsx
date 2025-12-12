type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

const iconMap: Record<IconProps["name"], string> = {
  message: "/icons/message-icon.svg",
  logo: "/icons/logo.svg",
  profile: "/icons/profile-icon.svg",
  calendar: "/icons/calendar.svg",
  distance: "/icons/distance.svg",
  location: "/icons/location.svg",
  heart: "/icons/heart.svg",
  size: "/icons/size.svg",
  condition: "/icons/condition.svg",
  date: "/icons/date.svg",
  sell: "/icons/sell.svg",
  purchase: "/icons/purchase.svg",
  car: "/icons/car.svg",
  arrowUp: "/icons/arrowUp.svg",
  clock: "/icons/clock.svg",
  toggle: "/icons/toggle.svg",
  whiteLocation: "/icons/white-location.svg",
  whiteCalendar: "/icons/white-calendar.svg",
};

const Icon = ({ name, size = 31, className = "" }: IconProps) => {
  const src = iconMap[name];
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={`${name} icon`}
      className={`block object-contain cursor-pointer ${className}`}
    />
  );
};

export default Icon;
