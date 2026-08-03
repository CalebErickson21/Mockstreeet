import { useEffect, useState } from "react";
import { checkHealthReadyHelper } from "../../utils/helpers";
import "./bootOverlay.scss";

const POLL_INTERVAL_MS = 3000;

const BootOverlay = () => {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let cancelled = false;
		let intervalId = null;

		const poll = async () => {
			const isReady = await checkHealthReadyHelper();
			if (cancelled || !isReady) return;

			setReady(true);
			if (intervalId !== null) {
				clearInterval(intervalId);
				intervalId = null;
			}
		};

		poll();
		intervalId = setInterval(poll, POLL_INTERVAL_MS);

		return () => {
			cancelled = true;
			if (intervalId !== null) {
				clearInterval(intervalId);
			}
		};
	}, []);

	useEffect(() => {
		if (!ready) {
			document.body.classList.add("modal-open");
		} else {
			document.body.classList.remove("modal-open");
		}

		return () => {
			document.body.classList.remove("modal-open");
		};
	}, [ready]);

	if (ready) return null;

	return (
		<div id="boot-overlay-container">
			<div className="modal-backdrop fade show"></div>
			<div
				className="modal fade show d-block"
				id="bootOverlay"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabIndex="-1"
				aria-labelledby="bootOverlayTitle"
				aria-modal="true"
				role="dialog"
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h2 className="modal-title" id="bootOverlayTitle">
								Starting up
							</h2>
						</div>
						<div className="modal-body">
							<p className="boot-overlay-message">
								The server is waking up - college student budget means the free
								plan, so cold starts are a thing. Hang tight while it crawls out of
								bed.
							</p>
							<div className="boot-overlay-spinner" aria-hidden="true"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BootOverlay;
