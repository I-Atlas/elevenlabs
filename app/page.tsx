import TextToSpeech from "./components/text-to-speech";

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Text to Speech using ElevenLabs API
        </h1>
        <TextToSpeech />
      </div>
    </main>
  );
}
