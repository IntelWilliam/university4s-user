import React from 'react'
import VideosContainer from 'src/client/modules/Moodle/Video/Videos/VideosContainer'

export default class VideosBySubLevel extends React.Component {

    playVideo(path, videoName, subLevelIndex, videoIndexOrLesson) {
      this.props.playVideo.call(null, path, videoName, subLevelIndex, videoIndexOrLesson);
    }

    render() {
        var arr = Object.keys(this.props.subLevelVideos).map((key) => {
            return this.props.subLevelVideos[key]
        });

        return (
            <div className="col-xs-12 section-name">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="image-drag-excercise">
                                <div className="pdf-icon-container">
                                    <img className="pdf-icon" src="/images/objetive.png"/>
                                </div>
                                <div className="info-title-container title-container flex">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <span className="info-title">{this.props.pageTexts[10]} {this.props.levelName}
                                            {/* <span className="info-title">Lista de videos - {this.props.levelName} */}
                                                &nbsp;{this.props.subLevelIndex}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="exercise-border-dotted">
                                <span>&nbsp;</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12 page-content">
                    <div className="row">

                        {arr.map((video, index) => {
                            return <VideosContainer key={index}
                              category = {this.props.category}
                              levelName = {this.props.levelName}
                              videoIndexOrLesson = {index}
                              subLevelIndex = {this.props.subLevelIndex}
                              playVideo = {this.playVideo.bind(this)}
                              video={video}/>
                        })}

                    </div>
                </div>
            </div>
        )

    }
}
