import { Box } from "@mui/material";
import { commonStyles } from "./styles";

export default function PaginateButtons(props: {
    totalDataCount: number;
    dataRange: number;
    setPageNumber: (pageNumber: number) => void;
}) {
    const { totalDataCount, dataRange, setPageNumber } = props;
    return (
        <Box sx={commonStyles.Pagination}>
            <ul className="pagination pg-blue justify-content-center">
                {[...Array(Math.ceil(totalDataCount / dataRange))].map(function (_, i) {
                    return (
                        <div
                            key={i}
                            className="pagination"
                            style={{
                                borderRadius: "20px",
                                paddingLeft: "5px",
                                fontWeight: "bold",
                            }}
                        >
                            <li
                                className="page-item"
                                key={i}
                                onClick={() => setPageNumber(i)}
                            >
                                <button className="page-link">
                                    {i + 1}
                                </button>
                            </li>
                        </div>
                    );
                })}
            </ul>
        </Box>
    );
}
