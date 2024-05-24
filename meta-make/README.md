# meta-make

An Electron application with React and TypeScript

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```


### Backlog

- [x] KBEditor::CreateMode, select first by default
- [x] KBEditor::EditMode, select format KB being edited
- [x] KBEditor, ability to create KB & save new KBs
  - [x] KB with set values get passed to backend
  - [x] KB is given a new unique ID
  - [x] KB is saved to disk
- [x] KBEditor, ability to change KB & save changes
- [ ] Extend MetaFormat for array of exporters
- [ ] Extend MetaBase to support varied helper model formats
  - [ ] Extend MetaBase to pass processed models to later generators
- [ ] Extend MetaProperty with conditionals
- [ ] Extend MetaProperty with linked data versions (i.e., codebooks)

### Buglist

- [ ] Main window -> New KB -> Back doesn't work
- [ ] Refresh KB in main window after loading data
- [ ] Up & down on list UI editors don't work
- [ ] Delete on list UI editors doesn't shift values
- [ ] Won't run if open ai key is not in env variables
- [ ] DCAT-AP-CZ periodicity has no name and desc.
