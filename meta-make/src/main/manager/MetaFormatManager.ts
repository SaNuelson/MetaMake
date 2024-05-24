import MetaFormat from '../../common/dto/MetaFormat.js'
import TitleOnly from '../format/TitleOnly.js'
import Essential from '../format/Essential.js'
import Basic from '../format/Basic.js'
import Long from '../format/Long.js'
import DcatApCz from '../format/DcatApCz.js'

class MetaFormatManager {
  private __metaFormats: {[name: string]: MetaFormat} = {
    [TitleOnly.name]: TitleOnly,
    [Essential.name]: Essential,
    [Basic.name]: Basic,
    [Long.name]: Long,
    [DcatApCz.name]: DcatApCz
  }

  public getMetaFormatList(): string[] {
    return Object.keys(this.__metaFormats);
  }

  // TODO: Remove
  public get metaFormats(): Array<MetaFormat> {
    return Object.values(this.__metaFormats)
  }

  getMetaFormat(name: string): MetaFormat | undefined {
    return this.__metaFormats[name];
  }
}

export default new MetaFormatManager();
