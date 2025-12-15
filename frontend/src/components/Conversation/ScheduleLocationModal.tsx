import React, { useState, useEffect } from "react";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (payload: { description: string; location: string }) => void;
	title?: string;
	initialDescription?: string;
	initialLocation?: string;
};

const ScheduleLocationModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onSubmit,
	title = "Pickup Location",
	initialDescription = "",
	initialLocation = "",
}) => {
	const [description, setDescription] = useState(initialDescription);
	const [location, setLocation] = useState(initialLocation);

	useEffect(() => {
		if (isOpen) {
			setDescription(initialDescription);
			setLocation(initialLocation);
		}
	}, [isOpen, initialDescription, initialLocation]);

	if (!isOpen) return null;

	const handleSend = () => {
		onSubmit?.({ description, location });
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div className="bg-[#F3F6F4] w-[520px] max-w-[90vw] rounded-2xl p-8 relative shadow-xl">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl font-bold"
					aria-label="Close"
				>
					&times;
				</button>

				<h2 className="text-xl font-bold text-green-dark text-center mb-6">
					{title}
				</h2>

				<div className="space-y-5">
					<div>
						<label className="block text-xs text-gray-500 font-semibold mb-2">
							Detailed Description (e.g. Exit A)
						</label>
						<input
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder=""
							className="w-full rounded-full bg-white border border-[#B9CFBF] px-4 py-2 outline-none focus:border-green-dark"
						/>
					</div>

					<div>
						<label className="block text-xs text-gray-500 font-semibold mb-2">
							Location
						</label>
						<input
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							className="w-full rounded-full bg-white border border-[#B9CFBF] px-4 py-2 outline-none focus:border-green-dark"
						/>
					</div>

					<div className="pt-2 flex justify-end">
						<button
							onClick={handleSend}
							className="px-6 py-2 rounded-full bg-[#D4E2D8] text-green-dark font-semibold hover:opacity-90"
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScheduleLocationModal;

