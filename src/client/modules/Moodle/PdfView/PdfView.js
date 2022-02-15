import React from 'react'
import PDFJSAnnotate from 'pdf-annotate';
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'
import loading from 'src/client/modules/Chat/Modals/loading'

require('pdfjs-dist/web/compatibility');
require('pdfjs-dist/build/pdf');
require('pdfjs-dist/web/pdf_viewer');

export default class PdfView extends React.Component {
  constructor() {
    super()
    this.state = {
      zoomPDF: 2,
      fontSize: 12,
      drawSize: 4,
      numPages: null,
      documentID: null,
      isSolution: false,
      loadSolution: false,
      existSolutionPdf: false,
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("PDF_VIEW", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body', body);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})


        let loadingNew = loading.replace(/text-to-load/g, body.texts[10]);
        // let loadingNew = loading.replace(/text-to-load/g, "Cargando PDF");
        swal({html: loadingNew, showCloseButton: false, showCancelButton: false, showConfirmButton: false})

      }
    })
  }

  componentWillMount(){
    this.loadPageTexts()
  }

  checkIfPdfSolution(){
    var pdfSolutionPath = `/api/pdf-solution/` + this.props.location.query.subName + '/Lesson '+ this.props.location.query.lessonIndex + '/' + this.props.location.query.name + '_Sol.pdf'
    $.ajax({
      url: pdfSolutionPath,
      type:'HEAD',
      error: ()=>
      {
        console.log('NOEXIST');
        //file not exists
      },
      success: () =>
      {
        this.setState({existSolutionPdf: true})
        // console.log('existe');
      }
    });
  }

  componentDidMount() {
    this.goTop()

    this.checkIfPdfSolution()

    // configuracion PDFjs y PDFJSAnnotate
    PDFJSAnnotate.setStoreAdapter(new PDFJSAnnotate.LocalStoreAdapter());
    PDFJS.workerSrc = '/pdfjs/pdf.worker.bundle.js';

    // se renderiza el pdf
    this.renderPdf(this.props.location.query.ultTo, (err, resp) => {
      if (resp) {
        swal.close()
      }
    })

  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  goBack() {
    window.history.back();
  }

  // funcion que carga y renderiza el PDF
  renderPdf(uriFile, callback) {
    console.log('uriFile', uriFile);

    console.log('uriFile', uriFile);

    if (!uriFile)
    return console.log("Sin Archivo");

    this.setState({documentID: uriFile})

    // console.log('uriFile', uriFile);

    var pdfLinkService = new PDFJS.PDFLinkService();

    const {UI} = PDFJSAnnotate;
    const RENDER_OPTIONS = {
      documentId: uriFile,
      pdfDocument: null,
      scale: this.state.zoomPDF,
      rotate: 0
    };

    // pdfLinkService.setViewer(UI.renderPage())

    let NUM_PAGES = 0;

    PDFJS.getDocument(RENDER_OPTIONS.documentId).then((pdf) => {
      RENDER_OPTIONS.pdfDocument = pdf;

      pdfLinkService.setDocument(pdf, null);

      let viewer = document.getElementById('viewer');
      viewer.innerHTML = '';
      NUM_PAGES = pdf.pdfInfo.numPages;
      this.setState({numPages: pdf.pdfInfo.numPages});
      for (let i = 0; i < NUM_PAGES; i++) {
        let page = UI.createPage(i + 1);
        viewer.appendChild(page);

        UI.renderPage(i + 1, RENDER_OPTIONS).then(([pdfPage, annotations]) => {
          let viewport = pdfPage.getViewport(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate);
          // PAGE_HEIGHT = viewport.height;
          // console.log('annotations', annotations);
          // console.log('PAGE_HEIGHT', PAGE_HEIGHT);
        });
      }

      // inicializa los valores para texto y dibujo
      UI.setText(this.state.fontSize, '#000000');
      UI.setPen(this.state.drawSize, '#000000');

      $('.pdf-bar').css({'display': 'flex'});
      this.setState({annotateUI: UI})

      callback(null, true)
    });

  }

  // habilita el texto
  anotateText() {
    this.state.annotateUI.disableEdit();
    this.state.annotateUI.disablePen();
    this.state.annotateUI.disablePoint();
    this.state.annotateUI.disableRect();

    this.state.annotateUI.enableText();
  }

  // habilita el dibujo
  anotateDraw() {
    this.state.annotateUI.disableEdit();
    this.state.annotateUI.disableText();
    this.state.annotateUI.disablePoint();
    this.state.annotateUI.disableRect();

    this.state.annotateUI.enablePen();
  }

  // habilit la edicion de anotaciones
  anotateEdit() {
    this.state.annotateUI.disablePen();
    this.state.annotateUI.disableText();
    this.state.annotateUI.disablePoint();
    this.state.annotateUI.disableRect();
    this.state.annotateUI.enableEdit();
  }

  zoomIn() {
    if (this.state.zoomPDF >= 3) {
      return console.log("Zoom Maximo");
    } else {
      let DEFAULT_SCALE_DELTA = 0.5;
      let MAX_SCALE = 3;
      let newScale = this.state.zoomPDF;

      newScale = (newScale + DEFAULT_SCALE_DELTA).toFixed(2);
      newScale = Math.ceil(newScale * 10) / 10;
      newScale = Math.min(MAX_SCALE, newScale);
      // this.state.zoomPDF = newScale

      this.setState({zoomPDF: newScale}, ()=>{

        this.renderPdf(this.props.location.query.ultTo, (err, resp) => {
          console.log('resp', resp);
        })
      })

    }
  }

  zoomOut() {
    if (this.state.zoomPDF == 0.5) {
      return console.log("Zoom Minimo");
    } else {

      let DEFAULT_SCALE_DELTA = 0.5;
      let MIN_SCALE = 0.5;

      let newScale = this.state.zoomPDF;
      newScale = (newScale - DEFAULT_SCALE_DELTA).toFixed(2);
      newScale = Math.floor(newScale * 10) / 10;
      newScale = Math.max(MIN_SCALE, newScale);

      // this.state.zoomPDF = newScale;
      this.setState({zoomPDF: newScale}, ()=>{

        this.renderPdf(this.props.location.query.ultTo, (err, resp) => {
          console.log('resp', resp);
        })
      })

      // this.renderPdf(this.props.location.query.ultTo, (err, resp) => {})
    }
  }

  printPages() {
    swal.close()

    let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[11]);
    // let loadingNew = loading.replace(/text-to-load/g, "Preparando PDF para descargar");
    swal({html: loadingNew, showCloseButton: false, showCancelButton: false, showConfirmButton: false})

    document.getElementById("content-wrapper").className += " html2canvasreset";

    // tamaño del PDF width * heigth
    var doc = new jsPDF('p', 'mm', [206, 286]);

    this.addImage(doc, 1)
  }

  addImage(doc, page) {
    var useWidth = $('#pageContainer' + page).prop('scrollWidth'); //document.getElementById("primary").style.width;
    var useHeight = $('#pageContainer' + page).prop('scrollHeight'); //document.getElementById("primary").style.height;

    html2canvas($('#pageContainer' + page), {
      width: useWidth,
      height: useHeight
    }).then((canvas) => {
      var imgData = canvas.toDataURL('image/jpeg', 0.7);
      doc.addImage(imgData, 'PNG', 0, 0, 206, 286);

      if (page >= this.state.numPages) {

        // nombre de el pdf
        doc.save(this.props.location.query.name);
        document.getElementById("content-wrapper").className -= " html2canvasreset";
        swal.close()

      } else {
        page += 1;
        doc.addPage();
        this.addImage(doc, page)
      }
    });
  }

  checkZoom() {
    if (this.state.zoomPDF != 2) {
      let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[12]);
      // let loadingNew = loading.replace(/text-to-load/g, "Ajustando Zoom");
      swal({html: loadingNew, showCloseButton: false, showCancelButton: false, showConfirmButton: false})
      // this.state.zoomPDF = 2;

      this.setState({zoomPDF: 2}, ()=>{

        this.renderPdf(this.props.location.query.ultTo, (err, resp) => {
          if (resp) {
            // tiempo aproximado mientras el Dom dibuja el nuevo PDF para poder usar html2canvas
            setTimeout(this.printPages.bind(this), 1000);
          }
        })
      })


    } else {
      this.printPages()
    }
  }

  changeFontSize(event) {
    this.state.annotateUI.setText(event.target.value, '#000000');
    this.setState({fontSize: event.target.value});
  }

  changeDrawSize(event) {
    this.state.annotateUI.setPen(event.target.value, '#000000');
    this.setState({drawSize: event.target.value});
  }

  // solo se borran las acnotaciones de el PDF actual
  clearAll() {
    swal({
      title: this.state.pageTexts[13],
      text: this.state.pageTexts[14],
      // title: '¿Esta seguro?',
      // text: "Se borraran todas las annotaciones realizadas!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.state.pageTexts[15]
      // confirmButtonText: 'Si, borrar!'
    }).then(() => {
      for (let i = 0; i < this.state.numPages; i++) {
        document.querySelector(`div#pageContainer${i + 1} svg.annotationLayer`).innerHTML = '';
      }
      localStorage.removeItem(`${this.state.documentID}/annotations`);
    })

  }

  exitSolution(){
    this.setState({isSolution: false})
    $( "#content" ).removeClass( "col-xs-6" ).addClass( "col-xs-12" );
    $('#content-solution').css('display', 'none');
    document.getElementById("content-wrapper").className -= " html2canvasreset";
    $('.hide-on-solution').css('display', '');

  }

  solutionPdf(){

    this.setState({isSolution: true})

    // $('.pdf-bar').css({'display': 'none'});
    $( "#content" ).removeClass( "col-xs-12" ).addClass( "col-xs-6" );
    $('#content-solution').css('display', '');
    $('.hide-on-solution').css('display', 'none');

    // document.getElementById("content-wrapper").className += " html2canvasreset";

    if(this.state.zoomPDF < 1 || this.state.zoomPDF > 1.5 ){
      // this.state.zoomPDF = 1.3;

      this.setState({zoomPDF: 1.3}, ()=>{
        this.renderPdf(this.props.location.query.ultTo, (err, resp) => {
          console.log('resp', resp);
        })

      })

    }


    // borra el pdf anterior
    // $( "#content-wrapper2" ).empty();

    if(!this.state.loadSolution){
      let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[16]);
      // let loadingNew = loading.replace(/text-to-load/g, "Cargando Solucionario");
      swal({html: loadingNew, showCloseButton: false, showCancelButton: false, showConfirmButton: false})
      this.renderPdfSolution( (err, resp) => {
        if (resp) {
          // swal.close()
        }
      })
    }

  }


  // funcion que carga y renderiza el PDF
  renderPdfSolution(callback) {

    var pdfSolutionPath = `/api/pdf-solution/` + this.props.location.query.subName + '/Lesson '+ this.props.location.query.lessonIndex + '/' + this.props.location.query.name + '_Sol.pdf'
    let uriFile = pdfSolutionPath

    PDFJS.externalLinkTarget = PDFJS.LinkTarget.BLANK

    let container = document.getElementById('content-wrapper2');

    // Load document
    PDFJS.getDocument(uriFile).then( (doc) => {
      var promise = Promise.resolve();
      this.setState({numPages: doc.numPages});

      for (var i = 0; i < doc.numPages; i++) {
        // One-by-one load pages
        promise = promise.then(function (id) {
          return doc.getPage(id + 1).then( (pdfPage) => {
            // Add div with page view.
            var SCALE = 1;
            var pdfPageView = new PDFJS.PDFPageView({
              container: container,
              id: id,
              scale: SCALE,
              defaultViewport: pdfPage.getViewport(SCALE),
              // We can enable text/annotations layers, if needed
              textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
              annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
            });
            // Associates the actual page with the view, and drawing it
            pdfPageView.setPdfPage(pdfPage);
            // this.count()
            this.setState({loadSolution: true})
            swal.close()
            return pdfPageView.draw();
          });
        }.bind(this, i));
      }
      return promise;
    });


    callback(null, true)
  }


  render() {
    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <div className="col-xs-12">
        <div className="row">
          <div id="content" className="col-xs-12 pdfjs-container">
            <div id="content-wrapper">
              <div id="viewer" className="pdfViewer"></div>
            </div>
          </div>

          <div id="content-solution" style={{display: "none"}} className="col-xs-6 pdfjs-container">
            <div id="content-wrapper2">
              <div id="viewer2" className="pdfViewer"></div>
            </div>
          </div>
        </div>

      </div>

      <div className="pdf-bar">

        <button className="solution-button pdf-bar-item mousePoint hide-on-solution" style={{
          background: "#0600ff"
        }} onClick={this.anotateEdit.bind(this)}>{this.state.pageTexts[0]}</button>
        {/* }} onClick={this.anotateEdit.bind(this)}>Editar Anotacion</button> */}
        <button className="solution-button pdf-bar-item mousePoint read-color hide-on-solution" onClick={this.anotateText.bind(this)}>{this.state.pageTexts[1]}</button>
        {/* <button className="solution-button pdf-bar-item mousePoint read-color hide-on-solution" onClick={this.anotateText.bind(this)}>Texto</button> */}
        <select className="text-size-select hide-on-solution" value={this.state.fontSize} onChange={this.changeFontSize.bind(this)}>
          <option value="8">8</option>
          <option value="10">10</option>
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
        </select>

        <button className="solution-button pdf-bar-item mousePoint audio-color hide-on-solution" onClick={this.anotateDraw.bind(this)}>{this.state.pageTexts[2]}</button>
        {/* <button className="solution-button pdf-bar-item mousePoint audio-color hide-on-solution" onClick={this.anotateDraw.bind(this)}>Dibujo</button> */}
        <select className="text-size-select audio-color hide-on-solution" value={this.state.drawSize} onChange={this.changeDrawSize.bind(this)}>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
          <option value="10">10</option>
        </select>
        <button className="solution-button pdf-bar-item mousePoint oral-color hide-on-solution" onClick={this.zoomIn.bind(this)}>{this.state.pageTexts[3]}</button>
        <button className="solution-button pdf-bar-item mousePoint oral-color hide-on-solution" onClick={this.zoomOut.bind(this)}>{this.state.pageTexts[4]}</button>
        <button className="solution-button pdf-bar-item mousePoint hide-on-solution" onClick={this.checkZoom.bind(this)}>{this.state.pageTexts[5]}</button>
        {/* <button className="solution-button pdf-bar-item mousePoint oral-color hide-on-solution" onClick={this.zoomIn.bind(this)}>Zoom +</button>
        <button className="solution-button pdf-bar-item mousePoint oral-color hide-on-solution" onClick={this.zoomOut.bind(this)}>Zoom -</button>
        <button className="solution-button pdf-bar-item mousePoint hide-on-solution" onClick={this.checkZoom.bind(this)}>Imprimir/ Guardar</button> */}
        <button className="solution-button pdf-bar-item mousePoint hide-on-solution" style={{
          background: "#d33"
        }} onClick={this.clearAll.bind(this)}>{this.state.pageTexts[6]}</button>
        {/* }} onClick={this.clearAll.bind(this)}>Borrar Todo</button> */}

      </div>

      <div className="button-back-pdf">
        <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>{this.state.pageTexts[7]}</button>
        {/* <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
      </div>


      {(() => {
        if (this.state.existSolutionPdf) {
          if (!this.state.isSolution) {
            return (
              <div className="button-solution-pdf">
                <button className="solution-button mousePoint solution-pdf-button" onClick={this.solutionPdf.bind(this)}>{this.state.pageTexts[8]}</button>
                {/* <button className="solution-button mousePoint solution-pdf-button" onClick={this.solutionPdf.bind(this)}>Solucionario</button> */}
              </div>
            )
          }else{
            return (
              <div className="button-solution-pdf">
                <button className="solution-button mousePoint solution-pdf-button" onClick={this.exitSolution.bind(this)}>{this.state.pageTexts[9]}</button>
                {/* <button className="solution-button mousePoint solution-pdf-button" onClick={this.exitSolution.bind(this)}>Edición</button> */}
              </div>
            )
          }
        }
      })()}

    </div>
  )
}

}
