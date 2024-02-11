export default function DataPreview() {
  return (
    <div>
      Data Preview
      <input type="file" onInput={(e) => onInputChanged(e.target as HTMLInputElement)} />
    </div>
  );
}

function onInputChanged(input: HTMLInputElement) {
  let files = input.files;
  if (files && files.length === 1) {
    window.api.loadData(files[0].path);
    window.api.onDataLoaded(onPreviewReceived)
  }
}

function onPreviewReceived(preview: string) {
  console.log(preview);
}
