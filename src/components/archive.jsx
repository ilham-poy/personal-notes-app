import { useState, useEffect } from "react";
export default function ComponentArchive({ onStatus }) {
    const [status, setStatus] = useState(false);

    useEffect(() => {
        onStatus(status);
    }, [status, onStatus]);

    return (
        <div className="archive-radio-group">
            <label className="archive-radio">
                <input
                    type="radio"
                    name="archive"
                    value="true"
                    checked={status === true}
                    onChange={() => setStatus(true)}
                />
                <span>Archive</span>
            </label>

            <label className="archive-radio">
                <input
                    type="radio"
                    name="archive"
                    value="false"
                    checked={status === false}
                    onChange={() => setStatus(false)}
                />
                <span>Not Archive</span>
            </label>
        </div>

    );
}