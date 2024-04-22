import { Popup } from 'devextreme-react/popup';

const ProjectExpensePopup = ({visible, onPopHiding}) => {

    const contentArea = () => {

    }

    return(
        <div>
            <Popup
                width={800}
                height={700}
                visible={visible}
                onHiding={onPopHiding}
                showCloseButton={true}
                contentRender={contentArea}
                title="근무시간 비용 Report"
            >
            </Popup>
        </div>
    )

}
export default ProjectExpensePopup;