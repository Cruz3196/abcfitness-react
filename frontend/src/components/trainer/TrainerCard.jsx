import { Link } from 'react-router-dom';

const TrainerCard = ({ trainer }) => {
    return (
        <div className="card w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105">
            {/* ✅ WRAPPED THE IMAGE IN A LINK */}
            <Link to={`/trainers/${trainer._id}`}>
                <figure className="px-10 pt-10">
                    <img
                    src={trainer.trainerProfilePic || 'https://placehold.co/150x150?text=Trainer'}
                    alt={trainer.user.username}
                    className="w-32 h-32 object-cover rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                    />
                </figure>
            </Link>
        <div className="card-body items-center text-center">
                {/* ✅ WRAPPED THE TITLE IN A LINK */}
                <h2 className="card-title">
                    <Link to={`/trainers/${trainer._id}`} className="hover:text-primary">
                        {trainer.user.username}
                    </Link>
                </h2>
                <p className="text-primary">{trainer.specialization}</p>
                <p className="text-sm text-base-content/70">{trainer.bio.substring(0, 80)}...</p>
                <div className="card-actions mt-4">
                <Link
                    to={`/trainers/${trainer._id}`}
                    className="btn btn-secondary btn-outline"
                >
                    View Profile
                </Link>
                </div>
            </div>
        </div>
    );
};

export default TrainerCard;

