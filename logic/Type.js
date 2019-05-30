export default class Type {
  constructor (data) {
    this.rawName = data.name
    switch (this.rawName) {
      case 'keynote':
        this.name = 'Keynotes'
        this.priority = 1
        break
      case 'maintrack':
        this.name = 'Main tracks'
        this.priority = 2
        break
      case 'devroom':
        this.name = 'Developer rooms'
        this.priority = 3
        break
      default:
        this.name = 'Other events'
        this.priority = 9
        break
    }
  }
}
