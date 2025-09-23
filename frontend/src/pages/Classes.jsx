import ClassCard from '../components/classes/ClassCard';
import Spinner from '../components/common/Spinner';

// --- MOCK DATA ---
// ✅ UPDATED: The trainer object now includes an _id to make linking possible.
const mockClasses = [
    { _id: 'class1', classTitle: 'Vinyasa Flow Yoga', classPic: 'https://placehold.co/400x225/6D28D9/FFFFFF?text=Yoga', trainer: { _id: 't1', user: { username: 'Jane Doe' } } },
    { _id: 'class2', classTitle: 'Advanced CrossFit', classPic: 'https://placehold.co/400x225/BE123C/FFFFFF?text=CrossFit', trainer: { _id: 't2', user: { username: 'John Smith' } } },
    { _id: 'class3', classTitle: 'HIIT Cardio Blast', classPic: 'https://placehold.co/400x225/047857/FFFFFF?text=HIIT', trainer: { _id: 't3', user: { username: 'Emily White' } } },
    { _id: 'class4', classTitle: 'Beginner Boxing', classPic: 'https://placehold.co/400x225/FACC15/000000?text=Boxing', trainer: { _id: 't4', user: { username: 'Mike Brown' } } },
];
// --- END MOCK DATA ---


const Classes = () => {
  // We now use the mock data directly instead of fetching from a store.
    const classes = mockClasses;
    const isLoading = false; // We are not loading any data, so this is false.

return (
        <div className="container mx-auto px-4 py-8">
            <div className="hero min-h-[30vh] bg-base-200 rounded-box mb-12">
                <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Our Classes</h1>
                    <p className="py-6">Find the perfect class to match your fitness goals, led by our expert trainers.</p>
                </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center pt-20"><Spinner /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.map(classInfo => (
                    <ClassCard key={classInfo._id} classInfo={classInfo} />
                ))}
                </div>
            )}
            
            {classes.length === 0 && !isLoading && (
                <div className="text-center text-base-content/60 py-20">
                <p>No classes are available at the moment. Please check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default Classes;

