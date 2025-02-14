import { useEffect, useState } from "react";

const Toggle = ({ initial, onChange }: { initial: boolean, onChange: (val: boolean) => void }) => {
    const [isActive, setIsActive] = useState(initial);

    useEffect(()=>{
        setIsActive(initial)
    }, [initial])
    
    const handleToggle = () => {
        const newValue = !isActive;
        setIsActive(newValue);
        onChange(newValue);
    };

    return (
        <div
            onClick={handleToggle}
            className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 ${isActive ? "bg-green-500" : "bg-gray-300"
                }`}
        >
            <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform ${isActive ? "translate-x-6" : "translate-x-0"
                    } transition-transform`}
            />
        </div>
    );
};

export default Toggle;
