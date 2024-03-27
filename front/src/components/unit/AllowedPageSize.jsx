const AllowedPageSize = (values) =>{
    let pageSizes=[];
    if(values.length < 20){
        pageSizes = [5, 10, 'all']
    }else if(values.length  < 50 ){
        pageSizes =  [10, 20, 'all']
    }else if(values.length  < 80) {
        pageSizes =  [20, 50, 'all']
    }else if(values.length  < 100){
        pageSizes =  [20, 50, 80, 'all']
    }else{
        pageSizes =  [20, 50, 80, 100]
    }
    return pageSizes;
}

export default AllowedPageSize;