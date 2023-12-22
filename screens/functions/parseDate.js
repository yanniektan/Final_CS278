export const formatDateString = (dateText) => {
    const date = new Date(dateText);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const dayWithOrdinal = addOrdinalSuffix(date.getDate());
  
    return formattedDate.replace(/\d+/, dayWithOrdinal);
  }
  
  function addOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return day + 'th';
    }
    switch (day % 10) {
      case 1:
        return day + 'st';
      case 2:
        return day + 'nd';
      case 3:
        return day + 'rd';
      default:
        return day + 'th';
    }
}      