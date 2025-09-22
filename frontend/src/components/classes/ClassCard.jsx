import { Link } from 'react-router-dom';

// This is the reusable "LEGO brick" for displaying a single class.
const ClassCard = ({ classInfo }) => {
    return (
        <div className="card card-compact w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105">
            <figure>
                <img 
                src={classInfo.classPic || 'https://placehold.co/400x225?text=Class'} 
                alt={classInfo.classTitle}
                className="h-48 w-full object-cover" 
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title truncate" title={classInfo.classTitle}>
                {classInfo.classTitle}
                </h2>
                <p>with {classInfo.trainer?.user?.username || 'TBD'}</p>
                <div className="card-actions justify-end">
                <Link to={`/classes/${classInfo._id}`}>
                    <button className="btn btn-secondary">View Details</button>
                </Link>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;

