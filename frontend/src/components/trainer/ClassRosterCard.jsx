import React from 'react';
import { Mail } from 'lucide-react';

const ClassRosterCard = ({ attendees }) => {
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Class Roster ({attendees.length})</h2>
                <div className="mt-2 space-y-3 max-h-96 overflow-y-auto">
                    {attendees.length > 0 ? (
                        attendees.map((attendee, index) => (
                            <div key={attendee._id || index} className="flex items-center justify-between p-2 rounded-lg bg-base-200">
                                <div className="flex items-center gap-3">
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                            <span>
                                                {attendee.username ? 
                                                    attendee.username.substring(0, 2).toUpperCase() : 
                                                    'U' + (index + 1)
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <span>
                                        {attendee.username || `User ${index + 1}`}
                                    </span>
                                </div>
                                {attendee.email && (
                                    <a href={`mailto:${attendee.email}`} className="btn btn-ghost btn-sm btn-circle">
                                        <Mail size={16} />
                                    </a>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-base-content/60 p-4">No one has registered yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassRosterCard;