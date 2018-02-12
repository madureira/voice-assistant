/**
 * Page reader engine.
 *
 * @class
 */
class PageReader {

  /**
   * Analyze the page info.
   * @return {Promise}
   */
  analyze() {
    return new Promise((resolve, reject) => {
      const pageDescription = document.getElementById('page-description');
      resolve(pageDescription.innerText);
    });
  }

}

export default PageReader;
