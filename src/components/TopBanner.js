import Participate from "../modals/Participate.js";
import { useState } from "react";

export default function TopBanner() {
  const [participateVisible, setParticipateVisible] = useState(false);

  return (
    <>
      {/* <TopHeader trigger={setParticipateVisible} /> */}
      <Participate
        show={participateVisible}
        onHide={() => setParticipateVisible(false)}
      />
    </>
  );
}
