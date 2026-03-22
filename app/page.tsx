"use client";

import EnvelopeScene from "@/components/EnvelopeScene";
import InvitationCard from "@/components/InvitationCard";
import { useMemo, useState } from "react";

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);

  const invitation = useMemo(
    () => ({
      babyName: "Baby Matthew Bryce",
      eventDateISO: "2026-05-17T10:00:00+08:00",
      church: "San Guillermo parish Church",
      churchAddress: "Zone 2, Iponan",
      reception: "Royal Panda, Kauswagan National Highway",
      receptionAddress: "Cagayan de Oro City",
      rsvpName: "Bitoonan & Cubillan Family",
      rsvpPhone: "+63 965 533 2358",
      parents: "With love from Roy jhon and Sarah Mae",
      godparents: [
        "Uncle Torres",
        "Uncle Reynan",
        "Uncle Rommel",
        "Uncle Ezequil",
      ],
    }),
    [],
  );

  const replay = () => {
    setOpened(false);
    setSceneKey((prev) => prev + 1);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-skyPaper text-ink">
      {!opened ? (
        <EnvelopeScene
          key={sceneKey}
          eventDateISO={invitation.eventDateISO}
          babyName={invitation.babyName}
          onComplete={() => setOpened(true)}
        />
      ) : (
        <InvitationCard invitation={invitation} onReplay={replay} />
      )}
    </main>
  );
}
