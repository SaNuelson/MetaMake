import { DomainEntry } from './Property.js'

export interface CodebookEntry extends DomainEntry {
  uri: string
  value: string
}
