
function readFile(files: FileList | null) {
  if (!files || !files.length)
    return;
  const reader = new FileReader();
  reader.onload = event => console.log(event?.target?.result); // desired file content
  reader.readAsText(files[0]); // you could also read images and other binaries
}

(async () => {
  const response = window.api.ping()
  console.log(response) // prints out 'pong'
})();

function App(): JSX.Element {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>

      <input type={"file"} onChange={e=>readFile(e.target?.files)}/>
    </div>
  )
}

export default App
