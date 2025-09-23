import { Link } from 'react-router-dom';

const Breadcrumbs = ({ paths }) => {
    if (!paths || paths.length === 0) {
        return null;
    }

    return (
        <div className="text-sm breadcrumbs">
            <ul>
                {paths.map((path, index) => (
                <li key={index}>
                    {/* If it's not the last item, make it a clickable link */}
                    {index < paths.length - 1 ? (
                    <Link to={path.link} className="link link-hover">
                        {path.name}
                    </Link>
                    ) : (
                    // The last item is the current page and is not a link
                    <span className="text-primary">{path.name}</span>
                    )}
                </li>
                ))}
            </ul>
        </div>
    );
};

export default Breadcrumbs;
