import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classStore } from '../../storeData/classStore';
import Spinner from './Spinner';

const ClassSchedule = () => {
    const navigate = useNavigate();
    const { classes, isLoading, error, fetchAllClasses, cleanupPastSessions } = classStore();
    const [selectedFilters, setSelectedFilters] = useState({
        classType: 'View All',
        instructor: 'View All',
        time: 'View All'
    });

    // Start with today as the default selected day
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    useEffect(() => {
        fetchAllClasses();
        
        // Clean up past sessions once per day
        const lastCleanup = localStorage.getItem('lastCleanup');
        const today = new Date().toDateString();
        
        if (lastCleanup !== today) {
            cleanupPastSessions();
            localStorage.setItem('lastCleanup', today);
        }
        
        // Set up an interval to refresh the schedule at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow.getTime() - now.getTime();
        
        const midnightTimeout = setTimeout(() => {
            // Refresh the component at midnight
            fetchAllClasses();
            
            // Set up daily interval after first midnight
            const dailyInterval = setInterval(() => {
                fetchAllClasses();
            }, 24 * 60 * 60 * 1000); // 24 hours
            
            return () => clearInterval(dailyInterval);
        }, timeUntilMidnight);
        
        return () => clearTimeout(midnightTimeout);
        
    }, [fetchAllClasses, cleanupPastSessions]);

    // Generate next 7 days starting from today
    const generateWeekDays = () => {
        const days = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            days.push({
                dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
                date: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'long' }),
                fullDate: date.toISOString().split('T')[0]
            });
        }
        return days;
    };

    const weekDays = generateWeekDays();
    const selectedDay = weekDays[selectedDayIndex];

    // Get unique values for filters - FIXED
    const getUniqueValues = (key) => {
        const values = classes.map(classInfo => {
            switch(key) {
                case 'classType': return classInfo.classType;
                case 'instructor': return classInfo.trainer?.user?.username || 'Unknown'; // FIXED
                case 'time': return classInfo.timeSlot?.startTime || 'TBD'; // FIXED
                default: return '';
            }
        });
        return ['View All', ...new Set(values.filter(Boolean))];
    };

    // Filter classes based on selected filters - FIXED
    const filteredClasses = classes.filter(classInfo => {
            const matchesType = selectedFilters.classType === 'View All' || 
                            classInfo.classType === selectedFilters.classType;
            const instructorName = classInfo.trainer?.user?.username || 'Unknown'; // FIXED
            const matchesInstructor = selectedFilters.instructor === 'View All' || 
                                    instructorName === selectedFilters.instructor;
            const matchesTime = selectedFilters.time === 'View All' || 
                            classInfo.timeSlot?.startTime === selectedFilters.time;
        
        return matchesType && matchesInstructor && matchesTime;
    });

    // Get classes for the selected day
    const getClassesForDay = (dayName, fullDate) => {
        const classesForDay = [];
        const selectedDate = new Date(fullDate);
        const today = new Date();
        
        // Only show classes for today and future dates
        if (selectedDate >= today || selectedDate.toDateString() === today.toDateString()) {
            filteredClasses.forEach(classInfo => {
                if (classInfo.timeSlot?.day === dayName) {
                    // Create a session instance for this specific date
                    const sessionInstance = {
                        ...classInfo,
                        sessionDate: fullDate,
                        sessionKey: `${classInfo._id}_${fullDate}`,
                        // Calculate spots based on general capacity (you might want to fetch actual bookings for this date)
                        spotsAvailable: classInfo.capacity - (classInfo.attendees?.length || 0),
                        // Add timing check to disable past sessions within the same day
                        isPastSession: selectedDate < today
                    };
                    classesForDay.push(sessionInstance);
                }
            });
        }
        
        return classesForDay;
    };

    const handleDayClick = (dayIndex) => {
        setSelectedDayIndex(dayIndex);
    };

    const handleClassDetails = (classId) => {
        navigate(`/classes/${classId}`);
    };

    const handleReserveSpot = (classId) => {
        navigate(`/classes/${classId}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="alert alert-error max-w-md mx-auto">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    const dayClasses = getClassesForDay(selectedDay.dayName, selectedDay.fullDate);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Class Schedule</h1>
                <p className="text-lg mb-2">Sort by class type, instructor and time below.</p>
                <p className="text-xl font-semibold">You can reserve a spot in class up to 72 hours in advance!</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <select 
                    className="select select-bordered"
                    value={selectedFilters.classType}
                    onChange={(e) => setSelectedFilters(prev => ({...prev, classType: e.target.value}))}
                >
                    {getUniqueValues('classType').map(type => (
                        <option key={type} value={type}>
                            {type === 'View All' ? 'Class Type' : type}
                        </option>
                    ))}
                </select>

                <select 
                    className="select select-bordered"
                    value={selectedFilters.instructor}
                    onChange={(e) => setSelectedFilters(prev => ({...prev, instructor: e.target.value}))}
                >
                    {getUniqueValues('instructor').map(instructor => (
                        <option key={instructor} value={instructor}>
                            {instructor === 'View All' ? 'Instructor' : instructor}
                        </option>
                    ))}
                </select>

                <select 
                    className="select select-bordered"
                    value={selectedFilters.time}
                    onChange={(e) => setSelectedFilters(prev => ({...prev, time: e.target.value}))}
                >
                    {getUniqueValues('time').map(time => (
                        <option key={time} value={time}>
                            {time === 'View All' ? 'Time' : time}
                        </option>
                    ))}
                </select>

            </div>

            {/* Day Navigation */}
            <div className="grid grid-cols-7 gap-2 mb-8">
                {weekDays.map((day, index) => (
                    <div 
                        key={index} 
                        className={`text-center p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedDayIndex === index 
                                ? 'bg-primary text-primary-content' 
                                : 'bg-base-200 hover:bg-base-300'
                        }`}
                        onClick={() => handleDayClick(index)}
                    >
                        <div className="font-semibold">{day.dayName}</div>
                        <div className="text-sm">
                            {day.month} {day.date}
                        </div>
                        {selectedDayIndex === index && (
                            <div className="w-full h-1 bg-red-500 mt-2"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Selected Day Classes */}
            <div className="space-y-1">
                {dayClasses.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-base-content/60">
                            <h3 className="text-xl font-semibold mb-4">No Classes Scheduled</h3>
                            <p>There are no classes scheduled for {selectedDay.dayName}, {selectedDay.month} {selectedDay.date}.</p>
                        </div>
                    </div>
                ) : (
                    dayClasses
                        .sort((a, b) => {
                            // Sort by start time
                            const timeA = a.timeSlot?.startTime || '';
                            const timeB = b.timeSlot?.startTime || '';
                            return timeA.localeCompare(timeB);
                        })
                        .map((classInfo) => (
                            <div key={classInfo._id} className="bg-base-100 border-b border-base-300 py-6 hover:bg-base-50 transition-colors">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                    {/* Class Type */}
                                    <div className="lg:col-span-2">
                                        <h3 className="text-xl font-bold">{classInfo.classType}</h3>
                                    </div>

                                    {/* Instructor & Location */}
                                    <div className="lg:col-span-3">
                                        <div className="text-primary font-semibold">
                                            {classInfo.trainer?.user?.username || 'TBD'}
                                        </div>
                                        <div className="text-sm opacity-70">
                                            Studio
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="lg:col-span-2">
                                        <div className="font-semibold text-lg">
                                            {classInfo.timeSlot?.startTime}-{classInfo.timeSlot?.endTime}
                                        </div>
                                    </div>

                                    {/* Spots */}
                                    <div className="lg:col-span-2">
                                        <div className="text-sm">
                                            <span className={`font-semibold ${
                                                (classInfo.attendees?.length || 0) >= classInfo.capacity 
                                                    ? 'text-error' 
                                                    : 'text-success'
                                            }`}>
                                                {classInfo.attendees?.length || 0}/{classInfo.capacity} Spots Taken
                                            </span>
                                        </div>
                                    </div>

                                    {/* Reserve Button */}
                                    <div className="lg:col-span-3 flex justify-end">
                                        <button 
                                            onClick={() => handleClassDetails(classInfo._id)}
                                            className="text-left btn btn-primary"
                                            data-session-date={classInfo.sessionDate} // Add session date data
                                        >
                                            Reserve Spot
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default ClassSchedule;