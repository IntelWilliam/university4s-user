import Constants from 'src/client/Constants/Constants'
import FluxStore from 'src/client/FluxStore';
import loginUser from 'src/client/modules/Login/'

class BoardStore extends FluxStore {
  constructor() {
      super()
    }
    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    createBoard(studentId, teacherId, content, callback) {

      $.post(Constants.API_LINK + 'boards/', {
        studentId: studentId,
        teacherId: teacherId,
        content: content
      }, (board) => {
        callback(board);
      }).fail((err) => {
        console.log(err)
        // callback(err)
        if (err.status == 401) {
          loginUser.logout((resp) => {
            callback(err)
          })
        } else {
          callback(err)
        }
      })
    }

}

let BoardStoreInstance = new BoardStore();

export default BoardStoreInstance;
