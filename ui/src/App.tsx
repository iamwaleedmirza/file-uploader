import { Page, Layout } from '@shopify/polaris'
import { FileUploader } from './components/file-uploader'

function App() {
  return (
    <>
      <Page title='File Uploader'>
        <Layout>
          <Layout.Section>
            <FileUploader />
          </Layout.Section>
        </Layout>
      </Page>
    </>
  )
}

export default App
