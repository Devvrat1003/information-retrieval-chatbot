import { useState } from "react";
import { useRecoilState } from "recoil";
import { userDetailsState } from "../atom/userDetails";
import { IoIosArrowDown } from "react-icons/io";

export default function UserDetailForm(props) {
    const [showRooms, setShowRooms] = useState(false);
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [userDetails, setUserDetails] = useRecoilState(userDetailsState);

    const setRoomType = (e) => {
        setUserDetails({ ...userDetails, RoomType: e.target.innerHTML });
        setShowRooms(false);
    };

    const handleSubmit = async () => {
        if (
            !userDetails.CheckInDate ||
            !userDetails.CheckOutDate ||
            !userDetails.GuestName ||
            !userDetails.Email ||
            !userDetails.RoomType
        ) {
            alert("Please fill in all the details before submitting.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/userDetails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userDetails),
            });

            if (!response.ok) {
                throw new Error("Failed to send details.");
            }

            const data = await response.json();
            console.log("Response from AI chatbot:", data);
            alert("Your details have been submitted successfully!");
        } catch (error) {
            console.error("Error submitting details:", error);
            alert("There was an error submitting your details. Please try again.");
        }
    };

    return (
        <div>
            <button
                className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Hide Form" : "Show Form"}
            </button>

            {showForm && (
                <div className="flex flex-col gap-2 mt-4">
                    <div>
                        <label htmlFor="checkInDate"> Check In Date: </label>
                        <input
                            type="date"
                            id="checkInDate"
                            onChange={(e) =>
                                setUserDetails({
                                    ...userDetails,
                                    CheckInDate: e.target.value,
                                })
                            }
                            className="border p-1 border-black rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="checkOutDate"> Check Out Date: </label>
                        <input
                            type="date"
                            id="checkOutDate"
                            onChange={(e) =>
                                setUserDetails({
                                    ...userDetails,
                                    CheckOutDate: e.target.value,
                                })
                            }
                            className="border p-1 border-black rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="NumGuests"> Number of Guests: </label>
                        <input
                            type="number"
                            id="NumGuests"
                            placeholder="Number of guests"
                            className="w-1/2 py-1 pl-1 focus:outline-none border border-black rounded"
                            onChange={(e) =>
                                setUserDetails({
                                    ...userDetails,
                                    NumGuests: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="GuestName">Your Name: </label>
                        <input
                            type="text"
                            id="GuestName"
                            placeholder="Your Name"
                            className="w-1/2 py-1 pl-1 focus:outline-none border border-black rounded"
                            onChange={(e) =>
                                setUserDetails({
                                    ...userDetails,
                                    GuestName: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="Email">Email: </label>
                        <input
                            type="email"
                            id="Email"
                            placeholder="Email"
                            className="w-1/2 py-1 pl-1 focus:outline-none border border-black rounded"
                            onChange={(e) =>
                                setUserDetails({
                                    ...userDetails,
                                    Email: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <label
                            htmlFor="RoomType"
                            className={`${showRooms ? "self-start" : ""}`}
                        >
                            Type of Room:
                        </label>
                        <div>
                            <button
                                className={`flex w-full p-1 focus:outline-none border border-black rounded justify-between items-center cursor-pointer ${
                                    showRooms ? "border-b-0 rounded-none" : ""
                                }`}
                                onClick={() => setShowRooms(!showRooms)}
                            >
                                <p>{userDetails.RoomType || "Select Room Type"}</p>
                                <IoIosArrowDown />
                            </button>
                            <div
                                className={`flex flex-col gap-1 border border-black [&>*]:cursor-pointer [&>*]:px-1 ${
                                    showRooms ? "visible" : "hidden"
                                }`}
                            >
                                <p className="hover:bg-[#5b5b5b]" onClick={setRoomType}>
                                    Deluxe Room
                                </p>
                                <p className="hover:bg-[#5b5b5b]" onClick={setRoomType}>
                                    Suite
                                </p>
                                <p className="hover:bg-[#5b5b5b]" onClick={setRoomType}>
                                    Standard Room
                                </p>
                                <p className="hover:bg-[#5b5b5b]" onClick={setRoomType}>
                                    Family Room
                                </p>
                                <p className="hover:bg-[#5b5b5b]" onClick={setRoomType}>
                                    Penthouse
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="NumRooms">Number of Rooms: </label>
                        <input
                            type="number"
                            id="NumRooms"
                            placeholder="Number of Rooms"
                            className="w-1/2 border border-black p-1 focus:outline-none rounded"
                            onChange={(e) =>
                                setUserDetails({
                                    ...userDetails,
                                    NumRooms: e.target.value,
                                })
                            }
                        />
                    </div>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                        onClick={handleSubmit}
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    );
}
