import { IoMdClose } from "react-icons/io";

export default function Navbar() {
    return (
        <div className="bg-black text-white w-full flex justify-between items-center p-2 rounded-t">
            <div className=" text-center text-base font-medium font-serif">
                Hotel Chatbot
            </div>
            <IoMdClose />
        </div>
    );
}
