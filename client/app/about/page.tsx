export default function About() {
  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 border-b pb-4">About Me</h1>
      <div className="prose lg:prose-xl text-gray-700 leading-relaxed space-y-6">
        <p>
          Welcome to my poem portfolio. I am a passionate writer exploring the depths of human emotion through verse.
        </p>
        <p>
          "Alas Poems" is a project dedicated to sharing these works with the world. 
          Here you will find a collection of my latest pieces, ranging from sonnets to free verse.
        </p>
        <p>
            Feel free to browse, like, and share the poems that resonate with you.
        </p>
        <div className="bg-gray-100 p-6 rounded-lg mt-8 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2 text-gray-800">Contact</h3>
            <p>Email: poet@alaspoems.com</p>
            <p>Twitter: @alaspoems</p>
        </div>
      </div>
    </main>
  );
}
