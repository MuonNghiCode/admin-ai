import ElevenLabsManagement from "@/components/admin/elevenlabs/ElevenLabsManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý ElevenLabs - Admin Dashboard",
  description: "Theo dõi hạn mức và token của ElevenLabs",
};

export default function ElevenLabsPage() {
  return <ElevenLabsManagement />;
}
