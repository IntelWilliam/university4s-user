export default `<div class="col-xs-12">
    <div class="row">
        <div class="row center-xs" style="width:100%;">
          <div class="col-xs-12">
              <span style="margin: 0px" class="title-teacher-feed">¿Qué lecciones se estudiaron?</span>
          </div>
          <div class="col-xs-8">
              <textarea style="height: 50px" id="lessonStuding" class="text-area-feed"></textarea>
          </div>
        </div>


        <div class="col-xs-12">
            <span class="title-teacher-feed">¿En qué nivel se encuentra el alumno?</span>
        </div>
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 center-flex">
                    <input name="group1" class="radio-feed" type="radio" id="initial" checked="checked" value="1" />
                </div>
                <div class="col-xs-12">
                    <label class="label-radio" for="initial">Inicial</label>
                </div>
            </div>
        </div>
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 center-flex">
                    <input name="group1" class="radio-feed" type="radio" id="fundamental" value="2" />
                </div>
                <div class="col-xs-12">
                    <label class="label-radio" for="fundamental">Fundamental</label>
                </div>
            </div>
        </div>
        <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-12 center-flex">
                    <input name="group1" class="radio-feed" type="radio" id="operational"  value="3" />
                </div>
                <div class="col-xs-12">
                    <label class="label-radio" for="operational">Operacional</label>
                </div>
            </div>
        </div>


        <div class="row center-xs" style="width:100%;">
            <div class="col-xs-12">
                <span style="font-size: 18px" class="title-teacher-feed">¿Reservó examen oral?</span>
            </div>
            <div class="col-xs-4">
                <div class="row">
                    <div class="col-xs-12 center-flex">
                        <input name="group2" class="radio-feed" type="radio" id="yes1" value="true" />
                    </div>
                    <div class="col-xs-12">
                        <label class="label-radio" for="yes1">Si</label>
                    </div>
                </div>
            </div>
            <div class="col-xs-4">
                <div class="row">
                    <div class="col-xs-12 center-flex">
                        <input name="group2" class="radio-feed" type="radio" id="no1" checked="checked" value="false" />
                    </div>
                    <div class="col-xs-12">
                        <label class="label-radio" for="no1">No</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="row center-xs" style="width:100%;">
            <div class="col-xs-12">
                <span style="font-size: 18px" class="comment-feed">¿Se presentó algún inconveniente?</span>
            </div>
            <div class="col-xs-8">
                <textarea style="height: 50px" id="comments" class="text-area-feed"></textarea>
            </div>
        </div>

    </div>

</div>`
