import * as Syringe from "@kuroi/syringe"
import { ChatMessage } from "../../common"
import { TestClient } from "./test-client"

@Syringe.Injectable({
  scope: "global"
})
export class MessageService implements Syringe.OnInit {

  private _messageDOMContainer!: HTMLElement | null

  constructor(
    @Syringe.Inject(TestClient)
    private _client: TestClient
  ) {

  }

  onInit(): void {
    this._messageDOMContainer = document.getElementById("messages")
  }

  public addMessage(_message: ChatMessage): void {
    if (!this._messageDOMContainer)
      return
    const _timestamp: Date = new Date()
    const _messageElement: HTMLDivElement = document.createElement("div")
    const _dateString: string = _timestamp.toLocaleDateString()
    const _timeString: string = _timestamp.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})
    _messageElement.innerHTML = `<div class="message-meta"><h4>User ${_message.id}</h4><span>${_dateString} ${_timeString}</span></div>`
    _messageElement.innerHTML += `<div class="message-content">${_message.message}</div>`
    _messageElement.classList.add("message")
    if (_message.id !== this._client.id)
      _messageElement.classList.add("incoming")
    this._messageDOMContainer.appendChild(_messageElement);
  }

}