export const getColorFromInitials = (name) => {
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
  };
  
  export const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };