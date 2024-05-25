import MetaFormat from '../../common/dto/MetaFormat.js'
import TitleOnly from '../custom/format/TitleOnly'
import Essential from '../custom/format/Essential'
import Basic from '../custom/format/Basic'
import Long from '../custom/format/Long'
import DcatApCz from '../custom/format/DcatApCz'

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
