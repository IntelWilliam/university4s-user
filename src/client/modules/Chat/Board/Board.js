import React from 'react'

export default class Board extends React.Component {
  componentDidMount() {
    let context = this;
    // se inicializa el tablero

    let boardHeigth = this.props.remoteVideo? 250 : 500

    tinymce.init({
      selector: 'textarea',
      // resize: "both"
      height: 500,
      setup: function(ed) {
        ed.on('change', function(e) {
          context.onTextChange(ed.getContent({ format: 'raw' }))
        });
        ed.on('keyup', function(e) {
          context.onTextChange(ed.getContent({ format: 'raw' }))
        });
      },
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools'
      ],
      toolbar: 'insertfile undo redo | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | responsivefilemanager',
      content_css: [
        '//www.tinymce.com/css/codepen.min.css'
      ],
      filemanager_crossdomain: true,
      external_filemanager_path: "https://image.re-cosmo.com/filemanager/",
      filemanager_title: "Responsive Filemanager",
      external_plugins: { "filemanager": "https://image.re-cosmo.com/filemanager/plugin.min.js" }
    });

    // Sets the raw contents of the activeEditor editor
    tinyMCE.activeEditor.setContent(this.props.boardContent, { format: 'raw' });
  }

  onTextChange(content) {
    // Get the raw contents of the currently active editor
    this.props.notifyBoardContentChanged.call(null, content);

  }
  render() {
    return (
      <div className="screen-board">
                <textarea>
                </textarea>
            </div>
    )
  }
}
