import './card.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

export default function BlogCard({data}) {


    const extractPlainText = (html) => {
        const tempDiv = document.createElement('div'); // Create a temporary div element
        tempDiv.innerHTML = html; // Set the inner HTML to the provided HTML string
        const plainText = tempDiv.textContent || tempDiv.innerText || ''; // Extract plain text
        return plainText;
    };

    // Extract plain text and truncate to first 2-3 lines (adjusted by word count)
    const truncateText = (text, wordLimit = 30) => {
        const words = text.split(' ').slice(0, wordLimit); // Get the first 'wordLimit' words
        return words.join(' ') + '...'; // Combine and add '...'
    };

    function formatCreatedAt(isoString) {
        const date = new Date(isoString); // Convert ISO string to Date object
    
        // Array of month names for formatting
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
    
        const month = months[date.getMonth()]; // Get the month's name
        const day = date.getDate(); // Get the day of the month
        const year = date.getFullYear(); // Get the year
    
        return `${month} ${day}, ${year}`; // Return formatted string
    }

    // Get plain text from the body and truncate it
    const plainText = extractPlainText(data.body);
    const truncatedText = truncateText(plainText);
    const date = formatCreatedAt(data.created_at)
    return (
        <div className="hero-container">
            {/* <div className="hero-background">
                <div className="hero-overlay"></div>
            </div> */}
            {/* <div className="hero-content">
                <div className="blog-grid"> */}
                    {/* Blog Card 1 */}
                    <div className="blog-card">
                        <div className="card-image">
                            <img
                                src= {data.imageURL}
                            />
                        </div>
                        <div className="card-content">
                            <div className="card-category">

                            </div>
                            <Link to={`/view/${data.post_id}/${data.User.username}`} className="card-title">
                                <div>{data.title}</div>
                                <p>
                                 {truncatedText}
                                </p>
                            </Link>
                            <div className="card-footer">
                                <div className="author-details">
                                    <a href="#">{data.User.username}</a>
                                    <div className="meta">
                                        <time dateTime="2020-03-16">{date}</time>
                                        <span> · {data.readTime} min read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        //     </div>
        // </div>
    )
}


BlogCard.propTypes = {
    data: PropTypes.object
}