import { Link } from 'react-router-dom';

// This is the reusable component for displaying a single class.
const ClassCard = ({ classInfo }) => {
    return (
        <div className="card card-compact w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105">
            <Link to={`/classes/${classInfo._id}`}>
                <figure>
                    <img
                        src={classInfo.classPic || 'https://placehold.co/400x225?text=Class'}
                        alt={classInfo.classTitle}
                        className="h-48 w-full object-cover"
                    />
                </figure>
            </Link>
            <div className="card-body">
                <h2 className="card-title truncate" title={classInfo.classTitle}>
                <Link to={`/classes/${classInfo._id}`} className="hover:text-secondary">
                        {classInfo.classTitle}
                    </Link>
                </h2>
                
                <p>
                with{' '}
                    <Link 
                        to={`/trainers/${classInfo.trainer?._id}`} 
                        className="link link-hover text-primary"
                    >
                        {classInfo.trainer?.user?.username || 'TBD'}
                    </Link>
                </p>

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

