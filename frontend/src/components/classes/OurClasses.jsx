import ClassCard from './ClassCard'; // Import the reusable class card
import { Link } from 'react-router-dom';

// This component is dynamic and can be used for any class section.
const Classes = ({ classes, title, subtitle }) => {
    if (!classes || classes.length === 0) {
        return null; 
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center my-8">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{subtitle}</p>
                <Link to="/classes">
                    <button className="btn btn-primary mt-7">View All Classes</button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* For each class, we render a reusable ClassCard */}
                {classes.map((classInfo) => (
                    <ClassCard key={classInfo._id} classInfo={classInfo} />
                ))}
            </div>
        </div>
    );
};

export default Classes;
