import { Loader } from "@/components/pastel/loader";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas">
      <Loader label="Loading the editor" />
    </div>
  );
}
