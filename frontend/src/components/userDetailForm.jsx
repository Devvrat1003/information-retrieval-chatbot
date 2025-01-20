import { useState } from "react";
import { useRecoilState } from "recoil";
import { userDetailsState } from "../atom/userDetails";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

export default function UserDetailForm(props) {
    const [showRooms, setShowRooms] = useState(false);

    const [userDetails, setUserDetails] = useRecoilState(userDetailsState);

    const setRoomType = (e) => {
        console.log(e.target.innerHTML);
        setUserDetails({ ...userDetails, RoomType: e.target.innerHTML });
        setShowRooms(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <div>
                <label htmlFor="checkInDate"> Check In Date: </label>
                <input
                    type="date"
                    id="checkInDate"
                    onChange={(e) => {
                        setUserDetails({
                            ...userDetails,
                            CheckInDate: e.target.value,
                        });
                        console.log(userDetails);
                    }}
                    className="border p-1 border-black rounded"
                />
            </div>
            <div>
                <label htmlFor="checkOutDate"> Check Out Date: </label>
                <input
                    type="date"
                    id="checkOutDate"
                    onChange={(e) => {
                        setUserDetails({
                            ...userDetails,
                            CheckInDate: e.target.value,
                        });
                        console.log(userDetails);
                    }}
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
                    onChange={(e) => {
                        setUserDetails({
                            ...userDetails,
                            GuestName: e.target.value,
                        });
                        console.log(userDetails);
                    }}
                />
            </div>

            <div>
                <label htmlFor="GuestName">Your Name: </label>
                <input
                    type="text"
                    id="GuestName"
                    placeholder="Your Name"
                    className="w-1/2 py-1 pl-1 focus:outline-none border border-black rounded"
                    onChange={(e) => {
                        setUserDetails({
                            ...userDetails,
                            GuestName: e.target.value,
                        });
                        console.log(userDetails);
                    }}
                />
            </div>

            <div>
                <label htmlFor="Email">Email: </label>
                <input
                    type="text"
                    id="Email"
                    placeholder="Email"
                    className="w-1/2 py-1 pl-1 focus:outline-none border border-black rounded"
                    onChange={(e) => {
                        setUserDetails({
                            ...userDetails,
                            GuestName: e.target.value,
                        });
                        console.log(userDetails);
                    }}
                />
            </div>

            <div className="flex items-center gap-1">
                <label
                    htmlFor=""
                    className={`${showRooms ? "self-start" : ""}`}
                >
                    Type of Room:{" "}
                </label>
                <div className="">
                    <button
                        className={`flex w-full p-1 focus:outline-none border border-black rounded justify-between items-center cursor-pointer ${
                            showRooms ? "border-b-0 rounded-none" : ""
                        }`}
                        onClick={() => {
                            setShowRooms(!showRooms);
                        }}
                    >
                        <p>{userDetails.RoomType}</p>
                        <IoIosArrowDown />
                    </button>
                    <div
                        className={`flex flex-col gap-1 border border-black [&>*]:cursor-pointer [&>*]:px-1   ${
                            showRooms ? "visible " : "hidden"
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
                    type="text"
                    id="NumRooms"
                    placeholder="Number of Rooms"
                    className="w-1/2 border border-black p-1 focus:outline-none rounded"
                />
            </div>
        </div>
    );
}
