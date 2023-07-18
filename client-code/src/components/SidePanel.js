export default function SidePanel() {
  return (
    <aside>
      <header>
        <div>
          <h2>PROJECT:</h2>
          <h4 className="project_name">Edit the name</h4>
          <div>
            <button>
              <i className="material-icons">mode_edit</i>
            </button>
            <button>
              <i className="material-icons">folder_delete</i>
            </button>
          </div>
        </div>
      </header>
      <div className="panel-view">
        <section className="panel-view-folder-tree">
          <header>
            <h2>FILES</h2>
            <div>
              <i className="material-icons">note_add</i>
              <i className="material-icons">create_new_folder</i>
            </div>
          </header>
        </section>
      </div>
      <footer></footer>
    </aside>
  );
}
