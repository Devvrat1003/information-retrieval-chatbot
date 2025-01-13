import Typewriter from "typewriter-effect";
export default function Test() {
    return (
        <div className="text-3xl">
            <Typewriter
                onInit={(typewriter) => {
                    typewriter
                        .typeString("Your Source for data driven Discovery")
                        .pauseFor(1000)
                        .deleteAll()
                        .pauseFor(500);
                    typewriter
                        .typeString("Personalize data as per your preference")
                        .pauseFor(1000)
                        .start();
                }}
                options={{
                    loop: true,
                    delay: 100,
                }}
            />
        </div>
    );
}
