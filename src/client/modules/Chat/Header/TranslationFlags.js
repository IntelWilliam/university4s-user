import React from 'react'

export default class TranslationFlags extends React.Component {
  render() {
    return (
      <ul id="translation-dropdown" className="dropdown-content">
        <li>
          <a href="#!"><img src="/images/flag-icons/United-States.png" alt="English" />  <span className="language-select">English</span></a>
        </li>
        <li>
          <a href="#!"><img src="/images/flag-icons/France.png" alt="French" />  <span className="language-select">French</span></a>
        </li>
        <li>
          <a href="#!"><img src="/images/flag-icons/China.png" alt="Chinese" />  <span className="language-select">Chinese</span></a>
        </li>
        <li>
          <a href="#!"><img src="/images/flag-icons/Germany.png" alt="German" />  <span className="language-select">German</span></a>
        </li>
      </ul>
    )
  }
}