import Chatbot from "../components/chatbot";
import hotel from "../assets/hotel.jpg";

export default function Home() {
    return (
        <div
            className={`bg-black z-10 bg-cover bg-center h-screen flex p-4`}
            style={{ backgroundImage: `url(${hotel})` }}
        >
            <Chatbot />
        </div>
    );
}
