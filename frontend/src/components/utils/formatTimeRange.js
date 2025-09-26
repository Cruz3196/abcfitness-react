export const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    
    return `${formattedHour}:${minutes} ${ampm}`;
};

export const formatTimeRange = (startTime, endTime) => {
    if (!startTime) return 'N/A';
    
    const formattedStart = formatTime(startTime);
    if (!endTime) return formattedStart;
    
    const formattedEnd = formatTime(endTime);
    return `${formattedStart} - ${formattedEnd}`;
};

export const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime || !durationMinutes) return null;
    
    const [hours, minutes] = startTime.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return endDate.toTimeString().slice(0, 5); // Format as HH:MM
};