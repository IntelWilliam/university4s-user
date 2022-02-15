export default `<div class="col-xs-12">
    <div class="row icons-faces">
        <div class="col-xs-3" id="very-good">
            <i class="material-icons very-good selected-face" data-value="5" onclick="$('.selected-face').removeClass('selected-face');$(this).addClass('selected-face');">sentiment_very_satisfied</i>
            <span style="font-size: 18px">Excelente</span>
        </div>

        <div class="col-xs-3" id="good">
            <i class="material-icons good" data-value="4" onclick="$('.selected-face').removeClass('selected-face');$(this).addClass('selected-face');">sentiment_satisfied</i>
            <span style="font-size: 18px">Bueno</span>

        </div>

        <div class="col-xs-3" id="normal">
            <i class="material-icons normal" data-value="3" onclick="$('.selected-face').removeClass('selected-face');$(this).addClass('selected-face');">sentiment_neutral</i>
             <span style="font-size: 18px">Regular</span>
       </div>

        <div id="low" class="col-xs-3 ">
            <i class="material-icons low" data-value="2" onclick="$('.selected-face').removeClass('selected-face');$(this).addClass('selected-face');">sentiment_dissatisfied</i>
            <span style="font-size: 18px">Malo</span>
        </div>

    </div>
    <div class="row center-xs">
        <div class="col-xs-12">
            <span class="comment-feed">Comentarios</span>
        </div>
        <div class="col-xs-8">
        	<textarea id="comments" class="text-area-feed"></textarea>
        </div>
    </div>
</div>`
